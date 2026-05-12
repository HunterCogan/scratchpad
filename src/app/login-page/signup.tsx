export function Signup() {
  return (
    <div className="bg-gray-900 min-h-screen flex items-center justify-center">
      <form className="bg-white p-8 rounded shadow-md w-full max-w-md">
        <h2 className="text-4xl font-bold text-blue-500">Sign Up</h2>
        <input type="text" placeholder="Enter your email" />
        <input type="password" placeholder="Enter your password" />
        <input type="confirm" placeholder="Confirm your password" />
        <button type="submit">Sign Up</button>
        <p>
          {"Already have an account?"} <a href="/login">Login</a>
        </p>
      </form>
    </div>
  );
}
