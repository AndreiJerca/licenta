import { useEffect, useState } from "react";
import { useRouter } from "next/router";
import Head from "next/head";
import styled from "styled-components";
import Header from "@/components/Header";
import { useSession } from "next-auth/react";
const Box = styled.div`
  background-color: #fff;
  margin-top: 10px;
  display: flex;
  flex-direction: row;
  justify-content: flex-start;
`;
const Labels = styled.div`
  background-color: #d9cbca;
  font-weight: bold;
  padding: 30px;
  gap: 5px;
  display: flex;
  flex-direction: column;
  justify-content: start;
`;
const Values = styled.div`
  background-color: #fff;
  padding: 30px;
  gap: 5px;
  display: flex;
  flex-direction: column;
  justify-content: start;
`;
export default function OrdersPage() {
  const { data: session, status } = useSession();
  const router = useRouter();

  useEffect(() => {
    if (status === "unauthenticated") router.push("/");
    console.log("ACCOUNT PAGE RENDERED");
  }, [status, router]);
  return (
    <>
      <Head>
        <title>Account</title>
        <meta name="viewport" content="initial-scale=1.0, width=device-width" />
      </Head>
      <Header />
      <Box>
        {status === "authenticated" ? (
          <>
            <Labels>
              <div>Nume:</div>
              <div>Email:</div>
            </Labels>
            <Values>
              <div> {session.user.name}</div>
              <div> {session.user.email}</div>
            </Values>
          </>
        ) : (
          <div>Nu esti autentificat</div>
        )}
      </Box>
    </>
  );
}
