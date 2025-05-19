'use client'

import { useRouter } from 'next/navigation'
import React, { useEffect } from 'react'

const Page = () => {
  const router = useRouter();

  useEffect(() => {
    router.push("/manager/users");
  }, []);

  return (
    <div></div>
  );
};

export default Page;
