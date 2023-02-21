import { GetServerSideProps } from "next";
import Link from "next/link";
import React from "react";
import { AuthService } from "service/auth_service";

function verify({ token }: { token: string }) {
  return (
    <div>
      <p>Your account has been verified</p>
      <Link href="/" className="text-blue-500">
        Back to Home
      </Link>
    </div>
  );
}

export const getServerSideProps: GetServerSideProps = async (context) => {
  const { token } = context.query;
  if (!token) {
    return {
      notFound: true,
    };
  }
  try {
    await AuthService.verify(token as string);
  } catch (error) {
    console.log(error);
    return {
      notFound: true,
    };
  }
  return {
    props: {
      token,
    },
  };
};

export default verify;
