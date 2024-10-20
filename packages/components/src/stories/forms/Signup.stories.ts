import type { Meta, StoryObj } from '@storybook/react';
import { fn } from '@storybook/test';

import { Signup } from '../../components/forms/Signup';

const meta = {
  component: Signup,
  args: {
    onClick: fn()
  }
} satisfies Meta<typeof Signup>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Primary: Story = {
  args: {
  }
}