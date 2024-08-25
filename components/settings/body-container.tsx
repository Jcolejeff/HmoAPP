import { Text } from '../ui/text';

interface SettingsBodyContainerProps {
  children: React.ReactNode;
  title: string;
  description: string;
}

export const SettingsBodyContainer = ({ children, title, description }: SettingsBodyContainerProps) => {
  return (
    <div className="flex h-screen w-full justify-center text-[13px]">
      <div className="container w-[640px]  py-14">
        <div className="mb-[28px] space-y-[6px]">
          <Text size="2xl" weight="medium">
            {title}
          </Text>
          <Text variant="secondary" size="sm" weight="medium">
            {description}
          </Text>
        </div>
        {children}
      </div>
    </div>
  );
};
