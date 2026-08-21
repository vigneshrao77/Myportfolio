import React from 'react';
import { WireframeDottedGlobe } from '@/components/ui/wireframe-dotted-globe';
import Tilt3D from './Tilt3D';

export default function ContactGlobe() {
  return (
    <Tilt3D maxTilt={8} className="contact-globe-container" style={{ width: '100%', height: '100%', minHeight: '380px', position: 'relative' }}>
      <WireframeDottedGlobe
        size={400}
        primaryColor="#C9A15A"
        dotColor="#FFE89E"
        arcColor="#FFD700"
        autoRotateSpeed={0.002}
        interactive={true}
      />
    </Tilt3D>
  );
}
