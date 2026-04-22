
'use client';

import React, { useRef, useImperativeHandle, forwardRef } from 'react';
import { Send, LoaderCircle, Sparkles } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent } from '@/components/ui/card';
import { cn } from '@/lib/utils';

type PlayerActionProps = {
  isLoading: boolean;
  onSubmit: (action: string) => Promise<void>;
  suggestedActions?: string[];
  onSuggestedActionClick?: (action: string) => void;
};

function SubmitButton({ isLoading }: { isLoading: boolean }) {
  return (
    <Button
      type="submit"
      size="icon"
      disabled={isLoading}
      aria-label="Send Action"
    >
      {isLoading ? (
        <LoaderCircle className="h-5 w-5 animate-spin" />
      ) : (
        <Send className="h-5 w-5" />
      )}
    </Button>
  );
}

const SuggestedActions = ({ actions, onActionClick }: { actions?: string[], onActionClick?: (action: string) => void; }) => {
    if (!actions || actions.length === 0) {
      return null;
    }
  
    return (
      <div className="mt-2 flex flex-wrap items-center gap-2 border-t pt-2">
        <Sparkles className="h-4 w-4 text-muted-foreground" />
        {actions.map((action, index) => (
          <Button
            key={index}
            variant="outline"
            size="sm"
            className="h-auto px-3 py-1 text-xs"
            onClick={() => onActionClick?.(action)}
          >
            {action}
          </Button>
        ))}
      </div>
    );
};

export const PlayerAction = forwardRef<HTMLTextAreaElement, PlayerActionProps>(
  ({ isLoading, onSubmit, suggestedActions, onSuggestedActionClick }, ref) => {
    const formRef = useRef<HTMLFormElement>(null);
    const internalInputRef = useRef<HTMLTextAreaElement>(null);

    // Expose the internal input ref to the parent component
    useImperativeHandle(ref, () => internalInputRef.current!);

    async function handleAction(formData: FormData) {
      const actionText = formData.get('action') as string;
      if (!actionText || isLoading) return;

      await onSubmit(actionText);
      formRef.current?.reset();
    }

    const handleKeyDown = (event: React.KeyboardEvent<HTMLTextAreaElement>) => {
      if (event.key === 'Enter' && !event.shiftKey) {
        event.preventDefault();
        formRef.current?.requestSubmit();
      }
    };

    return (
        <Card className={cn("shadow-none", 'bg-transparent border-none')}>
          <CardContent className="p-0">
            <div className="w-full rounded-lg border bg-card p-2 shadow-sm">
                <form
                ref={formRef}
                action={handleAction}
                className="flex w-full items-start space-x-2"
                >
                    <Textarea
                        ref={internalInputRef}
                        name="action"
                        placeholder="Type your action..."
                        onKeyDown={handleKeyDown}
                        className="flex-1 resize-none border-0 bg-transparent px-2 py-1.5 focus-visible:ring-0 focus-visible:ring-offset-0"
                        rows={1}
                        disabled={isLoading}
                    />
                    <SubmitButton isLoading={isLoading} />
                </form>
                <SuggestedActions actions={suggestedActions} onActionClick={onSuggestedActionClick} />
            </div>
          </CardContent>
        </Card>
    );
  }
);
PlayerAction.displayName = 'PlayerAction';
