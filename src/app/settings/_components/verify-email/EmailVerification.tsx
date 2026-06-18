"use client";

import { useState } from "react";
import { Button, Modal, useOverlayState } from "@heroui/react";

type EmailVerificationProps = {
  email: string;
  state: ReturnType<typeof useOverlayState>;
};

export default function EmailVerification({
  email,
  state,
}: EmailVerificationProps) {
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");

  async function handleResendVerification() {
    if (!email) return;

    try {
      setLoading(true);
      setMessage("");

      const res = await fetch("/api/auth/resend-verification", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email }),
      });

      if (!res.ok) {
        throw new Error();
      }

      setMessage("Verification email sent. Check your inbox.");
    } catch {
      setMessage("Failed to send verification email.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <Modal state={state}>
      <Modal.Trigger className="sr-only" tabIndex={-1} />

      <Modal.Backdrop variant="blur">
        <Modal.Container>
          <Modal.Dialog>
            <Modal.CloseTrigger />

            <Modal.Header>
              <Modal.Heading>Verify Email</Modal.Heading>
            </Modal.Header>

            <Modal.Body>
              <div className="flex flex-col gap-6 justify-center items-center text-center p-4 w-full text-black">
                <p>Email: {email}</p>

                <Button isDisabled={loading} onPress={handleResendVerification}>
                  {loading ? "Verifying..." : "Verify Account"}
                </Button>

                {message && (
                  <p className="text-sm text-default-500">{message}</p>
                )}
              </div>
            </Modal.Body>
          </Modal.Dialog>
        </Modal.Container>
      </Modal.Backdrop>
    </Modal>
  );
}
