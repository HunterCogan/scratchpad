"use client";

import { PlusIcon } from "@heroicons/react/24/solid";
import { Button } from "@heroui/react";

type Props = {
  createData: () => void;
};

export default function MongoTestButtons({ createData }: Props) {
  return (
    <div className="flex gap-3">
      <Button onPress={createData} className="bg-green-600">
        <PlusIcon /> Add MongoDB Test Data
      </Button>
    </div>
  );
}
