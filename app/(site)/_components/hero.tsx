import Link from "next/link";

import { buttonVariants } from "@/components/ui/button";
import { resumeUrl } from "@/lib/site-config";
import type { ProfileView } from "@/lib/types";

export function Hero({ profile }: { profile: ProfileView }) {
  const { name, role, intro, photoUrl } = profile;

  return (
    <section className="flex flex-col-reverse items-center gap-8 py-10 md:flex-row md:justify-between md:py-16">
      <div className="space-y-6 text-center md:text-left">
        <p className="font-mono text-sm text-primary" aria-hidden>
          {"< >"}
        </p>
        <div className="space-y-3">
          <h1 className="font-heading text-4xl font-bold tracking-tight text-balance md:text-5xl">
            {name}
          </h1>
          <p className="text-lg text-muted-foreground md:text-xl">{role}</p>
          <p className="max-w-xl text-pretty text-muted-foreground">{intro}</p>
        </div>
        <div className="flex flex-wrap justify-center gap-3 md:justify-start">
          <Link href="/contact" className={buttonVariants({ size: "lg" })}>
            연락하기
          </Link>
          {resumeUrl ? (
            <a
              href={resumeUrl}
              download
              className={buttonVariants({ variant: "outline", size: "lg" })}
            >
              이력서
            </a>
          ) : null}
        </div>
      </div>
      <div
        className="flex size-40 shrink-0 items-center justify-center rounded-full p-1.5 ring-4 ring-primary/70 md:size-56"
        role="img"
        aria-label={`${name} 프로필 사진`}
      >
        {photoUrl ? (
          // eslint-disable-next-line @next/next/no-img-element -- 외부 사진 주소가 정해지지 않아 일반 img 사용
          <img
            src={photoUrl}
            alt=""
            className="size-full rounded-full object-cover"
          />
        ) : (
          <span
            aria-hidden
            className="flex size-full items-center justify-center rounded-full bg-muted font-heading text-5xl font-bold text-muted-foreground md:text-6xl"
          >
            {name.slice(0, 1)}
          </span>
        )}
      </div>
    </section>
  );
}
