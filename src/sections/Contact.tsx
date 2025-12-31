export default function Contact() {
  return (
    <section id="contact" className="min-h-screen px-8 pt-16 flex items-center justify-center">
      <div className="w-full max-w-4xl rounded-lg bg-[var(--card)] text-[var(--text)] p-6 shadow-md">
        <h2 className="text-xl font-bold">Contact</h2>
        <p className="mt-4">
          Lorem ipsum dolor sit amet consectetur adipiscing elit sed do eiusmod tempor incididunt ut labore et dolore magna aliqua Ut enim ad minim veniam quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat
        </p>

        <div className="mt-6 grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="rounded-lg bg-[var(--card)] p-4">
            <h3 className="font-semibold">Get in touch</h3>
            <p className="mt-2 text-sm text-[var(--muted)]">Email: example@example.com</p>
            <p className="mt-1 text-sm text-[var(--muted)]">Phone: (000) 000-0000</p>
          </div>

          <div className="rounded-lg bg-[var(--card)] p-4">
            <h3 className="font-semibold">Socials</h3>
            <ul className="mt-2 list-disc ml-5">
              <li>LinkedIn: /your-profile</li>
              <li>GitHub: /your-username</li>
            </ul>
          </div>
        </div>
      </div>
    </section>
  );
}
