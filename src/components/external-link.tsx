import { Href, Link } from 'expo-router';
import { openBrowserAsync, WebBrowserPresentationStyle } from 'expo-web-browser';
import { type ComponentProps } from 'react';
import { ThemedText } from './themed-text';

type Props = Omit<ComponentProps<typeof Link>, 'href'> & { href: Href & string, text?: string };

export function ExternalLink({ href, text, ...rest }: Props) {
  return (
    <Link
      target="_blank"
      {...rest}
      href={href}
      onPress={async (event) => {
        if (process.env.EXPO_OS !== 'web') {
          // Prevent the default behavior of linking to the default browser on native.
          event.preventDefault();
          // Open the link in an in-app browser.
          await openBrowserAsync(href, {
            presentationStyle: WebBrowserPresentationStyle.AUTOMATIC,
          });
        }
      }}
    >
      <ThemedText type="default"  style={{color: "blue", textDecorationLine:"underline"}}>{text ?? ""}</ThemedText>
    </Link>
  );
}
