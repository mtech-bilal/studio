import { redirect } from 'next/navigation';

export default function Home() {
  // Redirect to the admin dashboard by default
  redirect('/admin/dashboard');
  // Or display a simple landing page if preferred
  // return (
  //   <main className="flex min-h-screen flex-col items-center justify-center p-24">
  //     <h1 className="text-4xl font-bold">Welcome to BookDoc</h1>
  //     <p className="mt-4 text-lg text-muted-foreground">
  //       Redirecting you to the admin dashboard...
  //     </p>
  //   </main>
  // );
}
