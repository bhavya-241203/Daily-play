import { getPlayer } from '../store/db';
import { VENUES } from '../data/venues';
import { sportEmoji } from '../utils/formatter';

export async function handleVenues(from: string): Promise<string> {
  const player = getPlayer(from);

  if (!player || player.registrationStep !== 'done') {
    return `Please register first! Type *register* to get started.`;
  }

  const cityVenues = VENUES.filter((v) => v.city.toLowerCase() === player.city.toLowerCase());

  if (cityVenues.length === 0) {
    return `No partner venues listed for ${player.city} yet.\n\nWe're expanding fast — check back soon! 🏟️`;
  }

  const lines: string[] = [`🏟️ *Partner Venues in ${player.city}*\n`];

  cityVenues.forEach((venue, i) => {
    const sportsStr = venue.sports.map(sportEmoji).join(' ');
    lines.push(`${i + 1}. *${venue.name}* — ${venue.area}`);
    lines.push(`   ${sportsStr} · ₹${venue.pricePerHour}/hr · ⭐ ${venue.rating}`);
    lines.push(`   📍 ${venue.address}`);
    lines.push(`   📞 ${venue.phone}`);
    lines.push(`   ⏰ ${venue.openTime} - ${venue.closeTime}`);
    if (venue.isPartner) lines.push(`   ✅ Official Daily Play Partner`);
    lines.push('');
  });

  lines.push(`Book via WhatsApp:`);
  if (cityVenues.length > 0) {
    const firstVenue = cityVenues[0];
    lines.push(`wa.me/${firstVenue.phone}?text=Hi, I want to book a slot`);
  }

  return lines.join('\n');
}
