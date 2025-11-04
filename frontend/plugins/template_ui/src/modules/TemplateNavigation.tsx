'use client';

import {
  Button,
  NavigationMenuGroup,
  Sidebar,
  TextOverflowTooltip,
} from 'erxes-ui';
import { Icon, IconTemplate } from '@tabler/icons-react';

function TemplateItem({ name, Icon }: { name: string; Icon: Icon }) {
  return (
    <Sidebar.Group className="p-0">
      <div className="w-full relative group/trigger hover:cursor-pointer">
        <div className="w-full flex items-center justify-between">
          <Button
            variant="ghost"
            className=" flex min-w-0 justify-start"
            asChild
          >
            <a href="/template">
              <Icon className="text-accent-foreground flex-shrink-0" />
              <TextOverflowTooltip
                className="font-sans font-semibold normal-case flex-1 min-w-0"
                value={name}
              />
            </a>
          </Button>
          <div className="size-5 min-w-5"></div>
        </div>
      </div>
    </Sidebar.Group>
  );
}

export const TemplateNavigation = () => {
  return (
    <NavigationMenuGroup name="Templates">
      <TemplateItem name="Templates" Icon={IconTemplate} />
    </NavigationMenuGroup>
  );
};
