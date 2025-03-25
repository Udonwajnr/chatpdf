import { Pinecone } from "@pinecone-database/pinecone";
import { convertToAscii } from "./utils";
import { getEmbeddings } from "./embeddings";

export async function getMatchesFromEmbeddings(
  embeddings: number[],
  fileKey: string
) {
  try {
    const client = new Pinecone({
      // environment: process.env.PINECONE_ENVIRONMENT!,
      apiKey: process.env.NEXT_PUBLIC_PINECONE_API_KEY!,
    });
    const pineconeIndex = await client.index("chatpdf");
    const namespace = pineconeIndex.namespace(convertToAscii(fileKey));
    const queryResult = await namespace.query({
      topK: 5,
      vector: embeddings,
      includeMetadata: true,
    });
    return queryResult.matches || [];
  } catch (error) {
    console.log("error querying embeddings", error);
    throw error;
  }
}

export async function getContext(query: string, fileKey: string) {
  const queryEmbeddings = await getEmbeddings(query);
  if (!queryEmbeddings || !Array.isArray(queryEmbeddings)) {
    console.error("Failed to generate embeddings");
    return "";
  }

  const matches = await getMatchesFromEmbeddings(queryEmbeddings, fileKey);

  const qualifyingDocs = matches.filter(
    (match) => match.score && match.score > 0.7
  );

  type Metadata = {
    text: string;
    pageNumber: number;
  };

  let docs = qualifyingDocs.map((match) => (match.metadata as Metadata).text);
  
  return docs.length > 0 ? docs.join("\n").substring(0, 3000) : "No relevant context found.";
}


export async function testingIt(query:string,fileKey:string){
  return console.log("hello")
}