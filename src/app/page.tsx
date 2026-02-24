import { redirect } from 'next/navigation'

// Home page goes straight to the bracket builder.
// Later: replace with a landing page when you have more to show.
export default function Home() {
  redirect('/bracket')
}
