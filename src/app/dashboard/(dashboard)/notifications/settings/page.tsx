'use client';

import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Button, buttonVariants } from '@/components/ui/button';
import Link from 'next/link';
import { cn } from '@/lib/utils';
import { ArrowLeft } from 'lucide-react';
import { routes } from '@/lib/routeHelpers';

export default function NotificationSettingsPage() {
  const [emailNotifications, setEmailNotifications] = React.useState(true);
  const [autoFollow, setAutoFollow] = React.useState(false);

  const handleSaveSettings = () => {
    // Handle saving notification settings
    console.log('Saving settings:', { emailNotifications, autoFollow });
  };

  return (
    <div className='container px-4 sm:px-6 mx-auto py-6 h-screen flex flex-col gap-y-6'>
      <div className='flex items-center justify-between'>
        <div className='flex items-center gap-2'>
          <Link
            href={routes.dashboard.root()}
            className={cn(buttonVariants({ variant: 'ghost', size: 'icon' }))}
          >
            <ArrowLeft className='h-4 w-4' />
          </Link>
          <h1 className='text-3xl font-bold'>Notification Settings</h1>
        </div>
      </div>
      <div className='flex justify-center items-center flex-1'>
        <Card className='w-full max-w-lg'>
          <CardHeader>
            <CardTitle className='text-2xl font-semibold text-center'>
              Notification Settings
            </CardTitle>
          </CardHeader>
          <CardContent className='space-y-6'>
            <div className='space-y-4'>
              <div className='flex flex-col gap-2 border p-4 rounded-md bg-muted'>
                <div className='flex items-center justify-between'>
                  <Label htmlFor='email-notifications' className='flex-1'>
                    Email me when I receive a Jelly notification
                  </Label>
                  <Switch
                    id='email-notifications'
                    checked={emailNotifications}
                    onCheckedChange={setEmailNotifications}
                  />
                </div>
                <p className='text-sm text-muted-foreground'>
                  Uncheck this to only see notifications within the app
                </p>
              </div>

              <div className='flex flex-col gap-2 border p-4 rounded-md bg-muted'>
                <div className='flex items-center justify-between'>
                  <Label htmlFor='auto-follow' className='flex-1'>
                    Automatically follow every new conversation
                  </Label>
                  <Switch
                    id='auto-follow'
                    checked={autoFollow}
                    onCheckedChange={setAutoFollow}
                  />
                </div>
                <p className='text-sm text-muted-foreground'>
                  You&apos;ll be notified of every new message (you can always
                  stop following a conversation later)
                </p>
              </div>
            </div>

            <Button className='w-full' onClick={handleSaveSettings}>
              Save my notification settings
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
