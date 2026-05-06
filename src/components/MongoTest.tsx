"use client";

import { useEffect, useState } from "react";
import MongoTestButtons from "./MongoTestButtons";
import MongoTestData from "./MongoTestData";

type TestItem = {
  _id: string;
  message: string;
  createdAt: string;
};

export default function MongoTest() {
  const [data, setData] = useState<TestItem[]>([]);

  const fetchData = async () => {
    const res = await fetch("/api/test");

    const text = await res.text();
    const json = text ? JSON.parse(text) : [];

    setData(json);
  };

  const createData = async () => {
    await fetch("/api/test", {
      method: "POST",
    });

    await fetchData();
  };

  const deleteData = async (id: string) => {
    await fetch("/api/test", {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ id }),
    });

    await fetchData();
  };

  // this can show data on page-load but it might not be useful for others, so keep commented
  // useEffect(() => {
  //   fetchData();
  // }, []);

  return (
    <div className="flex flex-col gap-5 w-full mt-6">
      <MongoTestButtons createData={createData} />

      <MongoTestData
        data={data}
        deleteData={deleteData}
      />
    </div>
  );
}