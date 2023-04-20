import Link from "next/link";
import styled from "styled-components";
import Center from "@/components/Center";
import { useContext, useState } from "react";
import { CartContext } from "@/components/CartContext";
import BarsIcon from "@/components/icons/Bars";
import { useSession, signIn, signOut } from "next-auth/react";
import Button from "./Button";
const StyledHeader = styled.header`
  background-color: #222;
`;
const Logo = styled(Link)`
  color: #fff;
  text-decoration: none;
  position: relative;
  z-index: 3;
`;
const Wrapper = styled.div`
  display: flex;
  justify-content: space-between;
  padding: 20px 0;
`;
const StyledNav = styled.nav`
  ${(props) =>
    props.mobileNavActive
      ? `
    display: block;
  `
      : `
    display: none;
  `}
  gap: 15px;
  position: fixed;
  top: 0;
  bottom: 0;
  left: 0;
  right: 0;
  padding: 70px 20px 20px;
  background-color: #222;
  @media screen and (min-width: 768px) {
    display: flex;
    position: static;
    padding: 0;
  }
`;
const NavLink = styled(Link)`
  display: block;
  color: #aaa;
  text-decoration: none;
  padding: 10px 0;
  @media screen and (min-width: 768px) {
    padding: 0;
  }
`;
const NavButton = styled.button`
  background-color: transparent;
  width: 30px;
  height: 30px;
  border: 0;
  color: white;
  cursor: pointer;
  position: relative;
  z-index: 3;
  @media screen and (min-width: 768px) {
    display: none;
  }
`;
const adminEmails = ["andrei.jerca00@e-uvt.ro"];

const LoginButton = () => {
  const { data: session } = useSession();
  //daca nu e autentificat, afiseaza buton login with google
  if (!session) {
    return (
      <div className="bg-bgGray w-screen h-screen flex items-center">
        <div className="text-center w-full">
          <button
            onClick={() => signIn("google")}
            className="bg-white p-2 px-4 rounded-lg"
          >
            Login with Google
          </button>
        </div>
      </div>
    );
  }
  //daca e autentificat
  return (
    <div className="bg-bgGray min-h-screen ">
      <div
        className="block md:hidden flex items-center p-4 "
        style={{ color: "white" }}
      >
        <div
          className=" flex items-center gap-4"
          style={{ display: "flex", gap: "10px" }}
        >
          {session.user.name}
          <button
            onClick={() => signOut("google")}
            className="bg-white p-2 px-4 rounded-lg"
          >
            Logout
          </button>
        </div>
      </div>
    </div>
  );
};

export default function Header() {
  const { data: session } = useSession();
  const { cartProducts } = useContext(CartContext);
  const [mobileNavActive, setMobileNavActive] = useState(false);
  return (
    <StyledHeader>
      <Center>
        <Wrapper>
          <Logo href={"/"}>Ecommerce</Logo>
          <StyledNav mobileNavActive={mobileNavActive}>
            <NavLink href={"/"}>Home</NavLink>
            <NavLink href={"/products"}>All products</NavLink>
            {adminEmails.includes(session?.user?.email) && (
              <NavLink href={"/categories"}>Categories</NavLink>
            )}
            {session?.user?.email && (
              <NavLink href={"/account"}>Account</NavLink>
            )}
            <NavLink href={"/cart"}>Cart ({cartProducts.length})</NavLink>
            <NavLink href={"/dashboard"}>Dashboard </NavLink>
          </StyledNav>
          <NavButton onClick={() => setMobileNavActive((prev) => !prev)}>
            <BarsIcon />
          </NavButton>
          <LoginButton />
        </Wrapper>
      </Center>
    </StyledHeader>
  );
}
