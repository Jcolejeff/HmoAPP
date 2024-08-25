import { Children, ReactNode, ReactElement, isValidElement, FC } from 'react';

interface ShowProps {
  children: ReactNode;
}

interface WhenProps {
  isTrue: boolean;
  children: ReactNode;
}

interface ElseProps {
  render?: ReactNode;
  children: ReactNode;
}

export const Show = (props: ShowProps): ReactElement | null => {
  let when: ReactElement | null = null;
  let otherwise: ReactElement | null = null;

  Children.forEach(props.children, child => {
    if (isValidElement(child)) {
      if (child.props.isTrue === undefined) {
        otherwise = child;
      } else if (!when && child.props.isTrue === true) {
        when = child;
      }
    }
  });

  return when || otherwise;
};

const ShowWhen: FC<WhenProps> & { displayName?: string } = ({ isTrue, children }) => (isTrue ? <>{children}</> : null);
ShowWhen.displayName = 'Show.When';

const ShowElse: FC<ElseProps> & { displayName?: string } = ({ render, children }) => <>{render || children}</>;
ShowElse.displayName = 'Show.Else';

Show.When = ShowWhen;
Show.Else = ShowElse;
