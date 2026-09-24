import React from "react";
import { fullName, initials } from "../../utils/people";

/* Profile photo when there is one, otherwise initials on the brand gradient */
const Avatar = ({ person, className = "w-9 h-9 text-xs" }) =>
  person?.profilePicUrl ? (
    <img src={person.profilePicUrl} alt={fullName(person)} className={`${className} rounded-full object-cover shrink-0 bg-slate-100`} />
  ) : (
    <span className={`${className} rounded-full bg-gradient-to-br from-[#0BCCEB] to-[#0A80F5] text-white font-bold flex items-center justify-center shrink-0`}>
      {initials(person)}
    </span>
  );

export default Avatar;
