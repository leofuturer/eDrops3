import { Post } from '../../models';

export const defaultPosts: Partial<Post>[] = [
  {
    id: 1,
    userId: 'aaaaaaaa-aaaa-aaaa-bbbb-aaaaaaaaaaaa',
    author: 'community1',
    title: 'Electrodes on EWOD device not actuating',
    content:
      'The electrodes on my EWOD device aren\'t activating. It\'s not related to the power source as I\'ve tried multiple power sources. I\'ve also tried different electrodes. I\'ve tried to contact the manufacturer but they haven\'t responded. Does anyone know what the problem could be?',
    datetime: new Date(Date.now() - 1000 * 60 * 60 * 24 * 7),
    comments: 1,
    likes: 0,
  },
  {
    id: 2,
    userId: 'aaaaaaaa-aaaa-aaaa-cccc-aaaaaaaaaaaa',
    author: 'community2',
    title: 'Dispensing not working on EWOD device',
    content:
      'For some reason the dispensing is not working on my EWOD device. I have tried everything I can think of. Any suggestions?',
    datetime: new Date(Date.now() - 1000 * 60 * 60 * 24 * 3),
    comments: 1,
    likes: 0,
  },
  {
    id: 3,
    userId: 'aaaaaaaa-aaaa-aaaa-dddd-aaaaaaaaaaaa',
    author: 'community3',
    title: 'What are EWOD devices used for?',
    content:
      'I\'m new to the community and would like to learn more about the different use cases for EWOD devices. I\'m interested in hearing from everyone about their experiences with EWOD devices. Thanks!',
    datetime: new Date(Date.now() - 1000 * 60 * 60 * 8),
    comments: 1,
    likes: 0,
  },
  {
    id: 4,
    userId: 'aaaaaaaa-aaaa-aaaa-eeee-aaaaaaaaaaaa',
    author: 'DropGek',
    title: 'What is the smallest droplet one can actuate on an EWOD chip?',
    content:
      'I wonder what would be the smallest droplet one can actuate on an EWOD chip? Are there any fundamental limitations imposed by EWOD?',
    datetime: new Date(Date.now() - 1000 * 60 * 60 * 8),
    comments: 0,
    likes: 0,
  },
  {
    id: 5,
    userId: 'aaaaaaaa-aaaa-aaaa-ffff-aaaaaaaaaaaa',
    author: 'Larry',
    title: 'Did anyone ever actuate whole blood on a DMF chip?',
    content:
      'I am working on a project that require manipulation of whole blood on a glass based EWOD chip, did anyone do that? I am concerned about the fouling issue.',
    datetime: new Date(Date.now() - 1000 * 60 * 60 * 8),
    comments: 1,
    likes: 0,
  },
  {
    id: 6,
    userId: 'aaaaaaaa-aaaa-aaaa-ffff-aaaaaaaaaaaa',
    author: 'Larry',
    title: 'Why can’t I cut the droplet on a paper based EWOD chip?',
    content:
      'I made a EWOD chip on paper substrate and assembled with an ITO glass as top plate (gap is 0.5mm). The electrode size is 2mm x 2mm. I am having a hard time cutting a droplet into two even using 200V (maximum voltage my instrument can provide). Does anyone have an idea?',
    datetime: new Date(Date.now() - 1000 * 60 * 60 * 8),
    comments: 0,
    likes: 0,
  },
  {
    id: 7,
    userId: 'aaaaaaaa-aaaa-aaaa-gggg-aaaaaaaaaaaa',
    author: 'LeoDMF',
    title: 'Let’s discuss killer application for digital microfluidics! Share your opinions here',
    content:
      'Channel-based continuous microfluidics and droplet microfluidics seem to be more widely used in the industry (Like the flow cell chip used in NGS and the droplet microfluidics chip used in single-cell transcriptomics sequencing library prep) What’s your opinion on potential killer applications for digital microfluidics?',
    datetime: new Date(Date.now() - 1000 * 60 * 60 * 8),
    comments: 0,
    likes: 0,
  },
  {
    id: 8,
    userId: 'aaaaaaaa-aaaa-aaaa-iiii-aaaaaaaaaaaa',
    author: 'Mark',
    title: 'Any recommendation of review papers about EWOD fundamental mechanisms?',
    content:
      'I recently started learning about EWOD and hope to apply it for my research. Any recommendation for review papers on fundamentals of EWOD? Thank you!',
    datetime: new Date(Date.now() - 1000 * 60 * 60 * 8),
    comments: 1,
    likes: 0,
  },
];
