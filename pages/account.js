import { useEffect, useState } from "react";
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
  const { data: session } = useSession();
  return (
    <>
      <Header />
      <Box>
        <Labels>
          <div>Nume:</div>
          <div>Email:</div>
        </Labels>
        <Values>
          <div> {session.user.name}</div>
          <div> {session.user.email}</div>
        </Values>
      </Box>
    </>
  );
}
