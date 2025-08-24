import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

type LoginFormProps = {
  formError: string | null;
  handleSubmit: (e: React.FormEvent<HTMLFormElement>) => Promise<void>;
};

export default function LoginForm({ formError, handleSubmit }: LoginFormProps) {
  return (
    <form className="space-y-5" onSubmit={handleSubmit}>
      <div>
        <label
          htmlFor="email"
          className="block text-sm font-medium text-gray-700 mb-1"
        >
          Email
        </label>
        <Input
          id="email"
          type="email"
          name="email"
          placeholder="you@example.com"
        />
      </div>

      <div>
        <label
          htmlFor="password"
          className="block text-sm font-medium text-gray-700 mb-1"
        >
          Password
        </label>
        <Input
          id="password"
          type="password"
          name="password"
          placeholder="••••••••"
        />
      </div>

      {/* {state.message && !state.success && (
        <div className="mb-4 rounded-md bg-red-50 border border-red-300 p-3">
          <p className="text-sm font-medium text-red-700 mb-2">
            {state.message}
          </p>
          <ul className="list-disc list-inside text-sm text-red-600 space-y-1">
            {Object.values(state.errors).map((msg, i) => (
              <li key={i}>{msg}</li>
            ))}
          </ul>
        </div>
      )} */}

      {formError && (
        <div className="mb-4 rounded-md bg-red-50 border border-red-300 p-3">
          <p className="text-sm font-medium text-red-700 mb-2">{formError}</p>
        </div>
      )}

      <Button type="submit" className="w-full text-lg">
        Log In
      </Button>
    </form>
  );
}
