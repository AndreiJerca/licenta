import { useEffect, useState } from "react";
import axios from "axios";
import Header from "@/components/Header";
import { useSession } from "next-auth/react";

export default function OrdersPage() {
  const { data: session } = useSession();
  return (
    <>
      <Header />
      <div> nume: {session.user.name}</div>
      <div>{JSON.stringify(session)}</div>
    </>
  );
}
