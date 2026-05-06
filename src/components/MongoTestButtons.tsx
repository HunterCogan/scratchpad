"use client";

import { PlusIcon } from "@heroicons/react/24/solid";
import { Button } from "@heroui/react";

type Props = {
  createData: () => void;
};

export default function MongoTestButtons({
  createData,
}: Props) {
  return (
    <div className="flex gap-3">
      <Button onPress={createData}>
        <PlusIcon /> Add MongoDB Test Data
      </Button>
    </div>
  );
}