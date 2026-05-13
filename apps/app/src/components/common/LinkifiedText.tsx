import { Fragment, useMemo } from 'react';
import { cn } from '@/utils/ts/cn';

const URL_REGEX = /(?:https?:\/\/|www\.)[^\s]+/gi;
const TRAILING_PUNCTUATION_REGEX = /[)\]}>.,!?;:'"`]+$/;
const INSTAGRAM_HANDLE_REGEX =
  /(^|[^A-Za-z0-9._])(@[A-Za-z0-9_](?:[A-Za-z0-9._]{0,28}[A-Za-z0-9_])?)(?=$|[^A-Za-z0-9._])/g;

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

const parseInstagramParts = (text: string): LinkPart[] => {
  const parts: LinkPart[] = [];
  const matcher = new RegExp(INSTAGRAM_HANDLE_REGEX);
  let lastIndex = 0;
  let match = matcher.exec(text);

  while (match) {
    const prefix = match[1] ?? '';
    const handle = match[2];
    const startIndex = match.index;
    const handleStartIndex = startIndex + prefix.length;
    const handleEndIndex = handleStartIndex + handle.length;

    if (startIndex > lastIndex) {
      parts.push({ type: 'text', value: text.slice(lastIndex, startIndex) });
    }

    if (prefix) {
      parts.push({ type: 'text', value: prefix });
    }

    parts.push({
      type: 'link',
      value: handle,
      href: `https://instagram.com/${handle.slice(1)}`,
    });

    lastIndex = handleEndIndex;
    match = matcher.exec(text);
  }

  if (lastIndex < text.length) {
    parts.push({ type: 'text', value: text.slice(lastIndex) });
  }

  return parts;
};

function LinkifiedText({ text, className, linkClassName }: LinkifiedTextProps) {
  const parts = useMemo(() => {
    return parseLinkParts(text).flatMap((part) => {
      if (part.type === 'link') {
        return [part];
      }

      return parseInstagramParts(part.value);
    });
  }, [text]);

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
