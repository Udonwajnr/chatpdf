
import { getContext } from '@/lib/context'

async function testGetContext() {
  const query = "What is AI?";
  const fileKey = "/sample-file-key";

  try {
    const context = await getContext(query, fileKey);
    console.log(context);
  } catch (error) {
    console.error("Error while testing getContext:", error);
  }
}

testGetContext();

export default function TestPage(){
 return(
  <>
    <button> 
      test the get context button
    </button>
  </>
 ) 
}