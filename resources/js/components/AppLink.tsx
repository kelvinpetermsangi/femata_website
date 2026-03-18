import { Link, type InertiaLinkProps } from '@inertiajs/react';
import type { AnchorHTMLAttributes, ReactNode } from 'react';
import { getPreviewHref, isPreviewMode } from '@/lib/previewRouting';

type AppLinkProps = {
  href: string;
  children: ReactNode;
} & Omit<InertiaLinkProps, 'href' | 'children'>;

export default function AppLink({ href, children, ...props }: AppLinkProps) {
  if (isPreviewMode()) {
    return (
      <a href={getPreviewHref(href)} {...(props as AnchorHTMLAttributes<HTMLAnchorElement>)}>
        {children}
      </a>
    );
  }

  return (
    <Link href={href} {...props}>
      {children}
    </Link>
  );
}
