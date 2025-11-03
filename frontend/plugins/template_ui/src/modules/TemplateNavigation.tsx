'use client';

import {
  Button,
  NavigationMenuGroup,
  NavigationMenuLinkItem,
  Sidebar,
  TextOverflowTooltip,
  DropdownMenu,
  useToast,
} from 'erxes-ui';
import {
  Icon,
  IconTemplate,
  IconSettings,
  IconLink,
  IconDotsVertical,
} from '@tabler/icons-react';
import { useNavigate } from 'react-router-dom';

const ActionsMenu = () => {
  const navigate = useNavigate();
  const { toast } = useToast();

  const handleCopyLink = async () => {
    const link = `${window.location.origin}/settings/template`;

    try {
      await navigator.clipboard.writeText(link);
      toast({
        variant: 'default',
        title: 'Link copied to clipboard',
      });
    } catch (e) {
      toast({
        variant: 'destructive',
        title: 'Failed to copy link',
        description: e as string,
      });
    }
  };

  return (
    <DropdownMenu>
      <DropdownMenu.Trigger asChild>
        <Button
          variant="ghost"
          size="icon"
          className="invisible group-hover/trigger:visible absolute top-1/2 -translate-y-1/2 right-1 text-muted-foreground"
          onClick={(e) => {
            e.stopPropagation();
          }}
        >
          <IconDotsVertical className="size-4" />
        </Button>
      </DropdownMenu.Trigger>
      <DropdownMenu.Content side="right" align="start" className="w-60 min-w-0">
        <DropdownMenu.Item
          className="cursor-pointer"
          onSelect={() => {
            navigate(`/settings/template`);
          }}
        >
          <IconSettings className="size-4" />
          Manage templates
        </DropdownMenu.Item>
        <DropdownMenu.Item
          onSelect={() => {
            handleCopyLink();
          }}
          className="cursor-pointer"
        >
          <IconLink className="size-4" />
          Copy link
        </DropdownMenu.Item>
      </DropdownMenu.Content>
    </DropdownMenu>
  );
};

function TemplateItem({ name, Icon }: { name: string; Icon: Icon }) {
  return (
    <Sidebar.Group className="p-0">
      <div className="w-full relative group/trigger hover:cursor-pointer">
        <div className="w-full flex items-center justify-between">
          <Button
            variant="ghost"
            className="px-2 flex min-w-0 justify-start"
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
          <div className="size-5 min-w-5 mr-2"></div>
        </div>
        <ActionsMenu />
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
