import { useEffect, useState } from "react";
import { tgValidate } from "../api/api.ts";
import { TgValidateResponse } from "../../functions/tgvalidate.ts";

export function App() {
  const [isLoading, setIsLoading] = useState(false);
  const [result, setResult] = useState<null | TgValidateResponse>(null);

  useEffect(() => {
    setIsLoading(true);
    tgValidate()
      .then((result) => {
        setResult(result);
      })
      .finally(() => {
        setIsLoading(false);
      });
  }, []);

  return (
    <div>
      <h4>Is loading: {isLoading ? "Yes" : "No"}</h4>
      {result && <h2>Hello {result.user.firstName}!</h2>}
    </div>
  );
}
