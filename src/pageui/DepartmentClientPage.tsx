'use client';

import React, { useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';

export default function DepartmentClientPage() {
  const params = useParams();
  const router = useRouter();
  const departmentSlug = params?.slug as string;

  useEffect(() => {
    if (departmentSlug) {
      router.push(`/department/${departmentSlug}/home`);
    }
  }, [departmentSlug, router]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center">
      <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
    </div>
  );
}
