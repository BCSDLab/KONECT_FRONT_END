import { Fragment, useMemo } from 'react';
import { cn } from '@/utils/ts/cn';

const URL_REGEX = /(?:https?:\/\/|www\.)[^\s]+/gi;
const TRAILING_PUNCTUATION_REGEX = /[)\]}>.,!?;:'"`]+$/;

type LinkPart =
  | {
      type: 'text';
      value: string;
    }
  | {
      type: 'link';
      value: string;
      href: string;
    };

interface LinkifiedTextProps {
  text: string;
  className?: string;
  linkClassName?: string;
}

const normalizeHref = (url: string) => {
  if (/^https?:\/\//i.test(url)) {
    return url;
  }

  return `https://${url}`;
};

const splitTrailingPunctuation = (value: string) => {
  const trailing = value.match(TRAILING_PUNCTUATION_REGEX)?.[0] ?? '';

  if (!trailing) {
    return { link: value, trailing: '' };
  }

  return {
    link: value.slice(0, -trailing.length),
    trailing,
  };
};

const parseLinkParts = (text: string): LinkPart[] => {
  const parts: LinkPart[] = [];
  const matcher = new RegExp(URL_REGEX);
  let lastIndex = 0;
  let match = matcher.exec(text);

  while (match) {
    const matchedText = match[0];
    const startIndex = match.index;
    const endIndex = startIndex + matchedText.length;

    if (startIndex > lastIndex) {
      parts.push({ type: 'text', value: text.slice(lastIndex, startIndex) });
    }

    const { link, trailing } = splitTrailingPunctuation(matchedText);

    if (link) {
      parts.push({ type: 'link', value: link, href: normalizeHref(link) });
    }

    if (trailing) {
      parts.push({ type: 'text', value: trailing });
    }

    lastIndex = endIndex;
    match = matcher.exec(text);
  }

  if (lastIndex < text.length) {
    parts.push({ type: 'text', value: text.slice(lastIndex) });
  }

  return parts;
};

function LinkifiedText({ text, className, linkClassName }: LinkifiedTextProps) {
  const parts = useMemo(() => parseLinkParts(text), [text]);

  const content = parts.map((part, index) => {
    if (part.type === 'text') {
      return <Fragment key={`text-${index}`}>{part.value}</Fragment>;
    }

    return (
      <a
        key={`link-${index}`}
        href={part.href}
        target="_blank"
        rel="noopener noreferrer"
        className={cn('text-primary break-all underline', linkClassName)}
      >
        {part.value}
      </a>
    );
  });

  if (className) {
    return <span className={className}>{content}</span>;
  }

  return <>{content}</>;
}

export default LinkifiedText;
