import React, { useState } from "react";
import { Link } from "react-router-dom";
import { getSecret } from "../lib/utils";

export function PasswordPrompt({
  onAuthenticate,
}: {
  onAuthenticate: (
    isAuthenticated: boolean
  ) => void | React.Dispatch<React.SetStateAction<boolean>>;
}) {
  const [input, setInput] = useState("");
  const [error, setError] = useState("");

  const handlePasswordCheck = (e: React.FormEvent) => {
    const correctPassword = getSecret();
    if (correctPassword === "") {
      console.log("Password not set");
      setError("Password not set");
      e.preventDefault();
      return;
    }
    if (input === correctPassword) {
      onAuthenticate(true);
    } else {
      e.preventDefault();
      setError("Incorrect password");
    }
  };

  return (
    <div className="h-screen w-screen flex justify-center items-center">
      <form action="" className="flex flex-col gap-2">
        <h1 className="text-white">Enter password</h1>

        <input
          type="password"
          value={input}
          autoFocus
          onChange={(e) => setInput(e.target.value)}
          onKeyUp={(e) => e.key === "Enter" && handlePasswordCheck(e)}
        />
        <button onClick={handlePasswordCheck}>Submit</button>
        {error && <p className="text-red-500">{error}</p>}
        <Link to="/">
          <p className="text-primary hover:underline">Go home</p>
        </Link>
      </form>
    </div>
  );
}
