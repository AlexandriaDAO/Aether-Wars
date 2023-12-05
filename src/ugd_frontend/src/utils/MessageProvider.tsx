// OG

import React, { useEffect, useState } from 'react';
import { ugd_backend } from '../declarations/ugd_backend';
import MessageContext from '../contexts/MessageContext';
import { string } from 'slate';

interface MessageProviderProps {
  children: React.ReactNode;
}

interface MessageCard {
  user_query: string;
  message: string;
}

interface SourceCard {
  post_id: bigint;
  user_query: string;
  author: string;
  title: string;
  heading: string;
  content: string;
  summary: string;
  bookmarked: boolean;
};

const MessageProvider: React.FC<MessageProviderProps> = ({ children }) => {
  let limitCards = [1, 2, 3, 4, 5]
  const [message, setMessage] = useState<MessageCard | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [currentAuthorId, setRandomAuthorId] = useState<string | null>(null);
  const [sourceCards, setSourceCards] = useState<any[]>([])


  const updateMessage = async (user_query: string) => {
    setIsLoading(true);
    try {
      const response: MessageCard[] = await ugd_backend.mc_front(user_query);

      if (response && response.length > 0) {
        const firstResponse = response[0];
        setMessage({
          user_query: firstResponse?.user_query ?? "",
          message: firstResponse?.message ?? "",
        });
        setError(null);
        console.log("Response recieved: ", message)
      } else {
        setError("No response received from the backend");
      }

    } catch (error) {
      setError(`Failed to fetch the message`);
    } finally {
      setIsLoading(false);
    }
  };



  async function queryWeaviate(clusters: any) {
    try {
        const response = await ugd_backend.get_weaviate_query("Sample Query", 2, clusters);
        console.log(`Weaviate Query Response for ${clusters}: `, response);

        const jsonResponse = JSON.parse(response);
        const postIds = jsonResponse.post_ids;

        for (const id of postIds) {
            const sc_key = BigInt(id);
            const sourceCard = await ugd_backend.get_sc(sc_key);
            console.log("Source Card Key: ", sc_key, "—Full sourcecard data from get_sc()", sourceCard);
        }

    } catch (error) {
        console.error(`Error querying ${clusters}: `, error);
    }
}

async function processQueries() {
    const clusters = ["The_Bible", "Carl_Jung", "Benjamin_Franklin"];

    const queryPromises = clusters.map(clusters => queryWeaviate(clusters));
    await Promise.allSettled(queryPromises);
}

// // Leave this commented while not testing queries.
// processQueries();

  const testSourceCards = async () => {

    const postId: bigint = BigInt(14);
  
    try {

      // const weaviateQueryResponse = await ugd_backend.get_weaviate_query("Sample Query", 1, "The_Bible"); // "The_Bible" here is the 'cluster' element of the 'author_data.ts' object. The 1 is how many to return.
      // console.log("Weaviate Query Response: ", weaviateQueryResponse);

      // await ugd_backend.save_sc("Example Query", "Example Author", "Example Title", "Example Heading", "Example Content", "Example Summary");
      // console.log("SourceCard saved successfully");

      // const sourceCardResponse = await ugd_backend.get_sc(postId);
      // console.log("SourceCard Response: ", sourceCardResponse);

      // await ugd_backend.delete_sc(postId);
      // console.log("SourceCard deleted successfully");

      // await ugd_backend.bookmark_sc(postId);
      // console.log("SourceCard bookmarked successfully");

    } catch (error) {
      console.error("Error performing actions with hardcoded inputs: ", error);
    }
  };

  // Calls every time for demo.
  // testSourceCards();


  const GetQueriedSourceCards = async ({ query }: any) => {
    setIsLoading(true)
    try {
      const weaviateQueryResponse = await ugd_backend.get_weaviate_query(query, limitCards.length, "The_Bible"); // "The_Bible" here is the 'cluster' element of the 'author_data.ts' object. The 1 is how many to return.
      console.log("Weaviate Query Response: ", weaviateQueryResponse);

      limitCards.map(async (item) => {
        await GetSourceCards({ postId: BigInt(item) })
      })

    } catch (error) {
      setIsLoading(false)
      setError(`Failed to fetch the message`);
      console.log(`Error while fetching queried source cards: ${error}`);
    }
  }


  const GetSourceCards = async ({ postId }: any) => {
    console.log(`PostId ${postId}`);
    setIsLoading(true)
    try {
      const sourceCardResponse = await ugd_backend.get_sc(postId);
      setSourceCards((prev) => ([...prev, ...sourceCardResponse]))
      setIsLoading(false)
    } catch (error) {
      setIsLoading(false)
      setError(`Failed to fetch the message`);
      console.log(`Error while fetching queried source cards: ${error}`);
    }
  }



  return (
    <MessageContext.Provider value={{ message, updateMessage, isLoading, error, currentAuthorId, setRandomAuthorId, GetQueriedSourceCards, sourceCards }}>
      {children}
    </MessageContext.Provider>
  );
};

export default MessageProvider;