import { requireNativeView } from 'expo';
import { useCallback, useState } from 'react';

import { type ViewEvent } from '../../types';
import { createViewModifierEventListener } from '../modifiers/utils';
import { type CommonViewModifierProps } from '../types';

export type ShareLinkProps = {
  /**
   * The URL or item to be shared.
   * This can be a web URL, a file path, or any other shareable item.
   */
  item?: string;

  /**
   * @todo
   */
  getItemAsync?: () => Promise<string>;

  /**
   * Optional subject for the share action.
   * This is typically used as the title of the shared content.
   */
  subject?: string;
  /**
   * Optional message for the share action.
   * This is typically used as a description or additional information about the shared content.
   */
  message?: string;
  /**
   * Optional preview for the share action.
   * This can include a title and an image to be displayed in the share dialog.
   */
  preview?: { title: string; image: string };
  /**
   * Optional children to be rendered inside the share link.
   */
  children?: React.ReactNode;
} & CommonViewModifierProps;

type NativeShareLinkProps = Omit<ShareLinkProps, 'getItemAsync'> &
  ViewEvent<'onRequestItem', object>;

const ShareLinkNativeView: React.ComponentType<NativeShareLinkProps> = requireNativeView(
  'ExpoUI',
  'ShareLinkView'
);

/**
 * Renders the native ShareLink component with the provided properties.
 *
 * @param {ShareLinkProps} props - The properties passed to the ShareLink component.
 * @returns {JSX.Element} The rendered native ShareLink component.
 * @platform ios
 */
export function ShareLink(props: ShareLinkProps) {
  const { modifiers, ...restProps } = props;
  const [item, setItem] = useState(props.item);

  const handleRequestItem = useCallback(async () => {
    if (props.getItemAsync) {
      const item = await props.getItemAsync?.();
      setItem(item);
      return;
    }
    if (props.item === undefined) {
      throw new Error('ShareLink: item is required');
    }
  }, [props.getItemAsync]);

  return (
    <ShareLinkNativeView
      modifiers={modifiers}
      item={item}
      onRequestItem={handleRequestItem}
      {...(modifiers ? createViewModifierEventListener(modifiers) : undefined)}
      {...restProps}
    />
  );
}
