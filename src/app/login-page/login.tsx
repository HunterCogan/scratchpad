export function LoginPage() {
  return (
    // the placeholder login form
    <div className="bg-gray-900 min-h-screen flex items-center justify-center">
      <form className="bg-white p-8 rounded shadow-md w-full max-w-md">
        <h2 className="text-4xl font-bold text-blue-500">Login</h2>
        <input type="text" placeholder="Enter your email" />
        <input type="password" placeholder="Enter your password" />
        <button type="submit">Login</button>
        <p>
          {"Don't have an account?"} <a href="/register">Sign up</a>
        </p>
      </form>
    </div>
  );
}
