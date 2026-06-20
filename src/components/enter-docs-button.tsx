// Enter docs button: paints an immediate pending state before route work starts.
'use client';

import Link from 'next/link';
import { useRouter } from 'next/navigation';
import {
  type MouseEvent,
  type PointerEvent,
  type ReactNode,
  useEffect,
  useRef,
  useState,
} from 'react';

type EnterDocsButtonProps = {
  href: string;
  children: ReactNode;
  className?: string;
};

function shouldUseBrowserNavigation(event: MouseEvent<HTMLAnchorElement>) {
  return (
    event.defaultPrevented ||
    event.button !== 0 ||
    event.metaKey ||
    event.ctrlKey ||
    event.shiftKey ||
    event.altKey ||
    event.currentTarget.target === '_blank'
  );
}

export function EnterDocsButton({ href, children, className }: EnterDocsButtonProps) {
  const router = useRouter();
  const navigatingRef = useRef(false);
  const [pending, setPending] = useState(false);

  useEffect(() => {
    router.prefetch(href);
  }, [href, router]);

  const markPending = () => {
    setPending(true);
  };

  const resetPending = () => {
    if (!navigatingRef.current) {
      setPending(false);
    }
  };

  const handlePointerDown = (event: PointerEvent<HTMLAnchorElement>) => {
    if (event.isPrimary) {
      markPending();
    }
  };

  const handleClick = (event: MouseEvent<HTMLAnchorElement>) => {
    if (shouldUseBrowserNavigation(event)) {
      return;
    }

    event.preventDefault();
    navigatingRef.current = true;
    markPending();

    window.requestAnimationFrame(() => {
      window.requestAnimationFrame(() => {
        router.push(href);
      });
    });
  };

  return (
    <Link
      aria-busy={pending}
      className={className}
      data-pending={pending ? 'true' : undefined}
      href={href}
      onClick={handleClick}
      onPointerCancel={resetPending}
      onPointerDown={handlePointerDown}
      onPointerLeave={resetPending}
      prefetch
    >
      <span className="enter-docs-button__label">{children}</span>
      <span className="enter-docs-button__indicator" aria-hidden="true" />
    </Link>
  );
}
