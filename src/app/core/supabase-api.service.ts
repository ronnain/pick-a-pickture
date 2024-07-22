import { Injectable } from '@angular/core';
import {
  AuthChangeEvent,
  AuthSession,
  createClient,
  Session,
  SupabaseClient,
  User,
} from '@supabase/supabase-js';
import { Database } from '../types/supabase';

// export interface Profile {
//   id?: string;
//   username: string;
//   website: string;
//   avatar_url: string;
// }

export type PickPicture = {
  id: number;
  thumbnailImageSrc: string;
  imageSrc: string;
  isSelectedByTheUser: boolean;
};

@Injectable({
  providedIn: 'root',
})
export class SupabaseApiService {
  private supabase = createClient<Database>(
    'https://sxbabjgpugvtcnxhpilr.supabase.co',
    'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InN4YmFiamdwdWd2dGNueGhwaWxyIiwicm9sZSI6ImFub24iLCJpYXQiOjE3MjE2MjUxNjAsImV4cCI6MjAzNzIwMTE2MH0.9M78rD-BI7J2L2Rzn84NObDyKUTiGm0tOX10zzJv0os'
  );
  // _session: AuthSession | null = null;

  // get session() {
  //   this.supabase.auth.getSession().then(({ data }) => {
  //     this._session = data.session;
  //   });
  //   return this._session;
  // }

  public getImageToPicked(roud: number) {
    return this.supabase
      .from('image-pick-by-round')
      .select(`id, imageSrc, thumbnailImageSrc, round${roud}`)
      .neq(`round${roud}`, null);
  }

  //   profile(user: User) {
  //     return this.supabase
  //       .from('profiles')
  //       .select(`username, website, avatar_url`)
  //       .eq('id', user.id)
  //       .single();
  //   }

  //   authChanges(
  //     callback: (event: AuthChangeEvent, session: Session | null) => void
  //   ) {
  //     return this.supabase.auth.onAuthStateChange(callback);
  //   }

  //   signIn(email: string) {
  //     return this.supabase.auth.signInWithOtp({ email });
  //   }

  //   signOut() {
  //     return this.supabase.auth.signOut();
  //   }

  //   updateProfile(profile: Profile) {
  //     const update = {
  //       ...profile,
  //       updated_at: new Date(),
  //     };

  //     return this.supabase.from('profiles').upsert(update);
  //   }

  //   downLoadImage(path: string) {
  //     return this.supabase.storage.from('avatars').download(path);
  //   }

  //   uploadAvatar(filePath: string, file: File) {
  //     return this.supabase.storage.from('avatars').upload(filePath, file);
  //   }
}
