import type { Meta, StoryObj } from '@storybook/react';
import {withRouter} from 'storybook-addon-remix-react-router'

import { NavTop } from '../../components/nav/NavTop';

const meta = {
  component: NavTop,
  decorators: [withRouter]
} satisfies Meta<typeof NavTop>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
  }
}

