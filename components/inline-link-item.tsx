import Image from "next/image";

type InlineLinkItemProps = {
  prefix: string;
  name: string;
  logoSrc: string;
  url: string;
};

export function InlineLinkItem({
  prefix,
  name,
  logoSrc,
  url,
}: InlineLinkItemProps) {
  return (
    <li>
      <span>{`${prefix} `}</span>
      <a
        href={url}
        target="_blank"
        rel="noopener noreferrer"
        className="group inline-link gap-x-2"
      >
        <span className="inline-link-label">{name}</span>
        <Image
          src={logoSrc}
          alt={`${name} logo`}
          width={18}
          height={18}
          className="h-[17px] w-auto shrink-0 opacity-80 transition-opacity duration-150 group-hover:opacity-100"
        />
      </a>
    </li>
  );
}
