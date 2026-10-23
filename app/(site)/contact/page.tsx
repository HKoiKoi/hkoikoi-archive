import { SectionHeading } from "@/components/layout/section";
import { ResumeButton } from "@/components/profile/resume-button";
import { contactLinks } from "@/lib/site-config";

import { ContactForm } from "./_components/contact-form";

export default function Page() {
  return (
    <section className="py-6 md:py-10">
      <SectionHeading
        as="h1"
        title="연락"
        description="문의 내용을 남겨 주시면 확인 후 회신드립니다."
      />
      <div className="grid gap-10 md:grid-cols-[minmax(0,1fr)_16rem]">
        <ContactForm />
        <aside className="space-y-4">
          <h2 className="font-heading text-lg font-semibold">바로 연락하기</h2>
          <ul className="space-y-2 text-sm">
            <li>
              <a
                href={contactLinks.github}
                target="_blank"
                rel="noopener noreferrer"
                className="text-primary underline-offset-4 hover:underline"
              >
                GitHub
              </a>
            </li>
            <li>
              <a
                href={`mailto:${contactLinks.email}`}
                className="text-primary underline-offset-4 hover:underline"
              >
                {contactLinks.email}
              </a>
            </li>
          </ul>
          <ResumeButton />
        </aside>
      </div>
    </section>
  );
}
