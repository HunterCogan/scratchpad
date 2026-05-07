"use client";

import { Button } from "@heroui/react";

type TestItem = {
  _id: string;
  message: string;
  createdAt: string;
};

type Props = {
  data: TestItem[];
  deleteData: (id: string) => void;
};

export default function MongoTestData({ data, deleteData }: Props) {
  return (
    <div className="w-full space-y-3">
      {data.map((item) => (
        <div
          key={item._id}
          className="flex items-center justify-between border rounded p-3"
        >
          <div>
            {item.message} — {new Date(item.createdAt).toLocaleString()}
          </div>

          <Button
            className="bg-red-500 text-white"
            onPress={() => deleteData(item._id)}
          >
            Delete
          </Button>
        </div>
      ))}
    </div>
  );
}
