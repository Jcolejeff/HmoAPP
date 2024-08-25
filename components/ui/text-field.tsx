import { Eye, EyeOff } from 'lucide-react';
import { Control } from 'react-hook-form';

import { FormControl, FormField, FormItem, FormLabel, FormMessage } from './form';
import { Input, InputProps } from './input';
import { Label } from './label';
import { Text } from './text';

export interface TextFieldProps extends InputProps {
  control: Control<any, any>;
  name: string;
  label?: string;
  showpassword?: boolean;
  setshowpassword?: (value: boolean) => void;
}

function TextField({ control, name, label, placeholder = name, ...rest }: TextFieldProps) {
  return (
    <FormField
      control={control}
      name={name}
      render={({ field }) => (
        <FormItem className="pb-2">
          <Label>{label && label}</Label>
          <div className="relative">
            <FormControl>
              <div>
                <Input placeholder={placeholder} {...rest} {...field} />
                {(name === 'password' || name === 'confirm_password') && (
                  <div className="absolute right-2 top-1/2 -translate-y-1/2 transform cursor-pointer">
                    {rest.showpassword ? (
                      <EyeOff
                        onClick={() => rest.setshowpassword && rest.setshowpassword(false)}
                        className="text-gray-400"
                      />
                    ) : (
                      <Eye
                        onClick={() => rest.setshowpassword && rest.setshowpassword(true)}
                        className="text-gray-400"
                      />
                    )}
                  </div>
                )}
              </div>
            </FormControl>
          </div>
          <FormMessage className="text-xs text-rose-600" />
        </FormItem>
      )}
    />
  );
}

export default TextField;
