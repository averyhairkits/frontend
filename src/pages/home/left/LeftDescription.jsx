import React from 'react';

import { Icon } from 'assets/icons/icons';

export default function LeftDescription() {
  return (
    <div className='white-bg'>
      <h3 className='how-to-title'>
        <Icon.HowTo className='how-to-icon' /> How-To
      </h3>
      <div className='log-entry'>
        <p>
          Lorem ipsum dolor sit amet, consectetur adipiscing elit. Suspendisse
          in scelerisque ipsum. Morbi a vulputate purus Duis vestibulum cursus
          erat vel suscipit. Nullam facilisis magna et libero egestas, eu
          fermentum.
        </p>
      </div>
      <h3 className='how-to-title'>
        <Icon.Faq className='Faq-icon' /> FAQS
      </h3>
      <div className='log-entry'>
        <div>
          <p>Lorem ipsum dolor sit amet?</p>
          <ul>
            <li>consectetur adipiscing elie</li>
          </ul>
        </div>
        <div>
          <p>Suspendisse in scelerisque ipsum?</p>
          <ul>
            <li>Morbi a vulputate purus</li>
          </ul>
        </div>
      </div>
    </div>
  );
}
