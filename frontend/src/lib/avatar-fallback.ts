export function getInitial(name?: string | null): string {
  if (!name || name.trim() === '') {
    return 'A';
  }
  return name.trim().charAt(0).toUpperCase();
}


export function getAvatarColor(name?: string | null): string {
  if (!name || name.trim() === '') {
    name = 'Anônimo';
  }

  let hash = 0;
  for (let i = 0; i < name.length; i++) {
    hash = name.charCodeAt(i) + ((hash << 5) - hash);
  }

  let color = '#';
  for (let i = 0; i < 3; i++) {
    const value = (hash >> (i * 8)) & 0xFF;
    color += ('00' + value.toString(16)).substr(-2);
  }

  return color;
}