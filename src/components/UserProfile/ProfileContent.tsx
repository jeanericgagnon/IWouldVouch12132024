import { User } from '../../types/user';
import { useAuth } from '../../hooks/useAuth';
import { ProfileHeaderSection, SkillsSection, ReferencesSection } from './sections';

interface ProfileContentProps {
  user: User;
}

export function ProfileContent({ user }: ProfileContentProps) {
  const { user: currentUser } = useAuth();
  const isOwner = currentUser?.id === user.id;

  return (
    <div className="space-y-8">
      <ProfileHeaderSection user={user} isOwner={isOwner} />
      <SkillsSection skills={user.skills} />
      <ReferencesSection userId={user.id} isOwner={isOwner} />
    </div>
  );
}