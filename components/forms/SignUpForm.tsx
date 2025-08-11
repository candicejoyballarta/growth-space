import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { SignupState } from "@/actions/signup";

type SignUpFormProps = {
  state: SignupState;
  action: (formData: FormData) => void;
};

export default function SignUpForm({ state, action }: SignUpFormProps) {
  return (
    <form action={action} className="space-y-5">
      {/* Name */}
      <div>
        <label
          htmlFor="name"
          className="block text-sm font-medium text-gray-700 mb-1"
        >
          Name
        </label>
        <Input
          id="name"
          name="name"
          type="text"
          placeholder="Your Name"
          defaultValue={state.formValues?.name}
        />
      </div>

      {/* Email */}
      <div>
        <label
          htmlFor="email"
          className="block text-sm font-medium text-gray-700 mb-1"
        >
          Email
        </label>
        <Input
          id="email"
          name="email"
          type="email"
          placeholder="you@example.com"
          defaultValue={state.formValues?.email}
        />
      </div>

      {/* Password */}
      <div>
        <label
          htmlFor="password"
          className="block text-sm font-medium text-gray-700 mb-1"
        >
          Password
        </label>
        <Input
          id="password"
          name="password"
          type="password"
          placeholder="Create a password"
        />
      </div>

      {/* General Error (bulleted list) */}
      {state.message && !state.success && (
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
      )}

      {/* Submit */}
      <Button type="submit" className="w-full text-lg">
        Create Account
      </Button>
    </form>
  );
}
