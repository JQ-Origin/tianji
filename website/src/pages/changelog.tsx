import useDocusaurusContext from '@docusaurus/useDocusaurusContext';
import Layout from '@theme/Layout';
import React from 'react';
import {
  VerticalTimeline,
  VerticalTimelineElement,
  VerticalTimelineElementProps,
} from 'react-vertical-timeline-component';
import {
  AiFillThunderbolt,
  AiOutlineArrowUp,
  AiOutlineCheck,
} from 'react-icons/ai';
import 'react-vertical-timeline-component/style.min.css';

const timelineStyle: Record<string, VerticalTimelineElementProps> = {
  current: {
    className: 'vertical-timeline-element--work',
    dateClassName: 'text-black dark:text-white',
    contentStyle: { background: 'rgb(33, 150, 243)', color: '#fff' },
    contentArrowStyle: { borderRight: '7px solid  rgb(33, 150, 243)' },
    iconStyle: { background: 'rgb(33, 150, 243)', color: '#fff' },
    icon: <AiFillThunderbolt />,
  },
  normal: {
    className: 'vertical-timeline-element--work dark:text-neutral-600',
    dateClassName: 'text-black dark:text-white',
    iconStyle: { background: 'rgb(33, 150, 243)', color: '#fff' },
    icon: <AiOutlineCheck />,
  },
  start: {
    className: 'vertical-timeline-element--work',
    iconStyle: { background: 'rgb(16, 204, 82)', color: '#fff' },
    icon: <AiOutlineArrowUp />,
  },
};

function Timeline() {
  return (
    <div className="bg-gray-100 dark:bg-opacity-0">
      <VerticalTimeline>
        <VerticalTimelineElement {...timelineStyle.current} date="now">
          <h3 className="vertical-timeline-element-title">Still Developing</h3>
          <h4 className="vertical-timeline-element-subtitle">Never stop</h4>
          <p>
            We have been continuously focusing on exploring the needs in this
            field and growing continuously. Just like you.
          </p>
        </VerticalTimelineElement>

        <VerticalTimelineElement {...timelineStyle.normal} date="2025/07/15">
          <h3 className="vertical-timeline-element-title">Release v1.24.0</h3>
          <p>add clickhouse infrastructure and support</p>
        </VerticalTimelineElement>

        <VerticalTimelineElement {...timelineStyle.normal} date="2025/07/06">
          <h3 className="vertical-timeline-element-title">Release v1.23.0</h3>
          <p>add server status in status page</p>
        </VerticalTimelineElement>

        <VerticalTimelineElement {...timelineStyle.normal} date="2025/06/18">
          <h3 className="vertical-timeline-element-title">Release v1.22.0</h3>
          <p>break change: change OPENAI_* env variable name</p>
        </VerticalTimelineElement>

        <VerticalTimelineElement {...timelineStyle.normal} date="2025/05/25">
          <h3 className="vertical-timeline-element-title">Release v1.21.0</h3>
          <p>add push monitor and cron monitor</p>
        </VerticalTimelineElement>

        <VerticalTimelineElement {...timelineStyle.normal} date="2025/04/14">
          <h3 className="vertical-timeline-element-title">Release v1.20.0</h3>
          <p>add AI Gateway</p>
        </VerticalTimelineElement>

        <VerticalTimelineElement {...timelineStyle.normal} date="2025/03/22">
          <h3 className="vertical-timeline-element-title">Release v1.19.0</h3>
          <p>add Application module</p>
        </VerticalTimelineElement>

        <VerticalTimelineElement {...timelineStyle.normal} date="2025/02/02">
          <h3 className="vertical-timeline-element-title">Release v1.18.0</h3>
          <p>add survey AI tools</p>
        </VerticalTimelineElement>

        <VerticalTimelineElement {...timelineStyle.normal} date="2024/11/19">
          <h3 className="vertical-timeline-element-title">Release v1.17.0</h3>
          <p>add subscription system</p>
        </VerticalTimelineElement>

        <VerticalTimelineElement {...timelineStyle.normal} date="2024/10/19">
          <h3 className="vertical-timeline-element-title">Release v1.16.0</h3>
          <p>add monitor summary</p>
          <p>improve monitor page display</p>
        </VerticalTimelineElement>

        <VerticalTimelineElement {...timelineStyle.normal} date="2024/09/18">
          <h3 className="vertical-timeline-element-title">Release v1.15.0</h3>
          <p>add lighthouse feature</p>
        </VerticalTimelineElement>

        <VerticalTimelineElement {...timelineStyle.normal} date="2024/08/29">
          <h3 className="vertical-timeline-element-title">Release v1.14.0</h3>
          <p>add workspace switch and create</p>
          <p>add workspace invite</p>
        </VerticalTimelineElement>

        <VerticalTimelineElement {...timelineStyle.normal} date="2024/08/11">
          <h3 className="vertical-timeline-element-title">Release v1.13.0</h3>
          <p>add authjs backend and new auth framework</p>
        </VerticalTimelineElement>

        <VerticalTimelineElement {...timelineStyle.normal} date="2024/07/22">
          <h3 className="vertical-timeline-element-title">Release v1.12.0</h3>
          <p>add channel feed feature</p>
        </VerticalTimelineElement>

        <VerticalTimelineElement {...timelineStyle.normal} date="2024/05/20">
          <h3 className="vertical-timeline-element-title">Release v1.11.0</h3>
          <p>add server docker view</p>
          <p>new homepage</p>
        </VerticalTimelineElement>

        <VerticalTimelineElement {...timelineStyle.normal} date="2024/05/15">
          <h3 className="vertical-timeline-element-title">Release v1.10.0</h3>
          <p>add survey</p>
        </VerticalTimelineElement>

        <VerticalTimelineElement {...timelineStyle.normal} date="2024/04/22">
          <h3 className="vertical-timeline-element-title">Release v1.9.0</h3>
          <p>add custom domain support for status page</p>
          <p>Add pl language!</p>
        </VerticalTimelineElement>

        <VerticalTimelineElement {...timelineStyle.normal} date="2024/04/09">
          <h3 className="vertical-timeline-element-title">Release v1.8.0</h3>
          <p>New Design!</p>
          <p>Add pt language!</p>
        </VerticalTimelineElement>

        <VerticalTimelineElement {...timelineStyle.normal} date="2024/03/08">
          <h3 className="vertical-timeline-element-title">Release v1.7.0</h3>
          <p>add telemetry feature</p>
          <p>improve docker image size(reduce 40% size)</p>
        </VerticalTimelineElement>

        <VerticalTimelineElement {...timelineStyle.normal} date="2024/02/15">
          <h3 className="vertical-timeline-element-title">Release v1.6.0</h3>
          <p>add i18n support</p>
          <p>add timeout in http monitor</p>
          <p>monitor add max retries to avoid network fluctuation</p>
        </VerticalTimelineElement>

        <VerticalTimelineElement {...timelineStyle.normal} date="2024/02/01">
          <h3 className="vertical-timeline-element-title">Release v1.5.0</h3>
          <p>add visitor map</p>
          <p>add audit log</p>
          <p>add previous period in website overview</p>
          <p>add audit log for monitor</p>
        </VerticalTimelineElement>

        <VerticalTimelineElement {...timelineStyle.normal} date="2024/01/14">
          <h3 className="vertical-timeline-element-title">Release v1.4.0</h3>
          <p>add apprise notification</p>
          <p>add status page delete action</p>
          <p>add tcp port monitor</p>
          <p>allow display current response value in monitor list</p>
          <p>add arm64 support</p>
        </VerticalTimelineElement>

        <VerticalTimelineElement {...timelineStyle.normal} date="2024/01/09">
          <h3 className="vertical-timeline-element-title">Release v1.3.0</h3>
          <p>add monitor badge</p>
          <p>add telegram notification support</p>
          <p>add tokenizer for notification</p>
          <p>dashboard card title allow edit</p>
          <p>add daily cron job to calc workspace usage</p>
        </VerticalTimelineElement>

        <VerticalTimelineElement {...timelineStyle.normal} date="2024/01/01">
          <h3 className="vertical-timeline-element-title">Release v1.2.0</h3>
          <p>Add custom monitor!</p>
          <p>Now you can build your custom monitor logic with javascript</p>
        </VerticalTimelineElement>

        <VerticalTimelineElement {...timelineStyle.normal} date="2023/12/30">
          <h3 className="vertical-timeline-element-title">Release v1.1.0</h3>
          <p>Add delete data/event action for monitor</p>
          <p>Add monitor order with updatedAt</p>
          <p>Fix http header json validator problem</p>
        </VerticalTimelineElement>

        <VerticalTimelineElement {...timelineStyle.normal} date="2023/12/25">
          <h3 className="vertical-timeline-element-title">Open Source!</h3>
          <p>We think open source can help more and more people</p>
          <p>Tianji loves open source</p>
        </VerticalTimelineElement>

        <VerticalTimelineElement {...timelineStyle.normal} date="2023/11/9">
          <h3 className="vertical-timeline-element-title">Start Alpha Test</h3>
          <p>Invite some people test it</p>
        </VerticalTimelineElement>

        <VerticalTimelineElement {...timelineStyle.start} />
      </VerticalTimeline>
    </div>
  );
}

export default function Changelog(): JSX.Element {
  const { siteConfig } = useDocusaurusContext();
  return (
    <Layout title={'Change Log'} description="Insight into everything">
      <Timeline />
    </Layout>
  );
}
