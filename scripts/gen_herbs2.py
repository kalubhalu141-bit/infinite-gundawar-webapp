#!/usr/bin/env python3
"""Append remaining herbs to herbs.ts and close the array."""
import json, os, sys

HERBS_TS = os.path.join(os.path.dirname(__file__), '..', 'src', 'lib', 'herbs.ts')

# Read current file
with open(HERBS_TS, 'r', encoding='utf-8') as f:
    content = f.read()

# The file is truncated at devadaru entry. We need to:
# 1. Truncate back to the last complete entry (ushira)
# 2. Add remaining herbs
# 3. Close the array

# Find the last complete entry - ushira ends with category: 'skin' },
# The devadaru entry is incomplete, so we truncate before it

# Find the position of ushira's closing
ushira_end = content.rfind("category: 'skin' },\n")
if ushira_end == -1:
    print("ERROR: Could not find ushira end")
    sys.exit(1)

# Truncate to after ushira's closing line
truncated = content[:ushira_end + len("category: 'skin' },\n")]

# Now we need to add more herbs. We'll add them as raw TS, not using json.
# Each herb is written as a raw string to avoid any escaping issues.

remaining_herbs = [
    # devadaru (complete version)
    """  { id: 'devadaru', name: 'Devadaru (Himalayan Cedar)', sanskrit: 'देवदारु', alsoKnownAs: ['Daru', 'Suradaru'], botanical: 'Cedrus deodara', family: 'Pinaceae', partsUsed: ['Heartwood', 'Oil'], rasa: ['Katu', 'Tikta', 'Kashaya'], guna: ['Laghu', 'Snigdha'], virya: 'Ushna', vipaka: 'Katu', dosha: 'Balances Kapha & Vata', classicalUses: ['Shothahara', 'Kasa-shwasahara', 'Vranaropana', 'Krimighna'], evidence: 'Moderate', evidenceNote: 'Anti-inflammatory, antimicrobial, and wound-healing effects supported.', formulations: ['Devadaru Taila', 'Prabhadra Taila'], source: 'Charaka Samhita, Sutrasthana 4', precautions: 'Generally safe.', emoji: '🌲', image: 'https://upload.wikimedia.org/wikipedia/commons/thumb/5/5e/Cedrus_deodara.jpg/640px-Cedrus_deodara.jpg', category: 'respiratory' },""",
    # musta
    """  { id: 'musta', name: 'Musta (Nut Grass)', sanskrit: 'मूस्ता', alsoKnownAs: ['Nagaramotha'], botanical: 'Cyperus rotundus', family: 'Cyperaceae', partsUsed: ['Tuber'], rasa: ['Katu', 'Tikta', 'Kashaya'], guna: ['Laghu', 'Ruksha'], virya: 'Sheeta', vipaka: 'Katu', dosha: 'Balances Pitta & Kapha', classicalUses: ['Jwaraghna', 'Atisara-ghna', 'Stanyajanana', 'Deepana'], evidence: 'Moderate', evidenceNote: 'Anti-inflammatory, antidiarrheal, and antipyretic effects supported.', formulations: ['Mustakarishta', 'Panchakola'], source: 'Charaka Samhita, Sutrasthana 4', precautions: 'Generally safe.', emoji: '🌾', image: 'https://upload.wikimedia.org/wikipedia/commons/thumb/5/5e/Cyperus_rotundus.jpg/640px-Cyperus_rotundus.jpg', category: 'digestive' },""",
    # parpataka
    """  { id: 'parpataka', name: 'Parpataka', sanskrit: 'पर्पटक', alsoKnownAs: ['Raktapushpa'], botanical: 'Fumaria indica / Fumaria parviflora', family: 'Papaveraceae', partsUsed: ['Whole plant'], rasa: ['Tikta', 'Kashaya'], guna: ['Laghu', 'Ruksha'], virya: 'Sheeta', vipaka: 'Katu', dosha: 'Balances Pitta & Kapha', classicalUses: ['Jwaraghna', 'Kusthaghna', 'Raktashodhana', 'Deepana'], evidence: 'Moderate', evidenceNote: 'Blood-purifying and antipyretic effects supported.', formulations: ['Parpatadi Kwatha', 'Chandraprabha Vati'], source: 'Bhavaprakasha Nighantu', precautions: 'Generally safe.', emoji: '🌿', image: 'https://upload.wikimedia.org/wikipedia/commons/thumb/5/5e/Fumaria_indica.jpg/640px-Fumaria_indica.jpg', category: 'skin' },""",
    # patola
    """  { id: 'patola', name: 'Patola (Pointed Gourd)', sanskrit: 'पटोल', alsoKnownAs: ['Karkashchhada'], botanical: 'Trichosanthes dioica', family: 'Cucurbitaceae', partsUsed: ['Leaf', 'Fruit', 'Root'], rasa: ['Tikta', 'Katu'], guna: ['Laghu', 'Ruksha'], virya: 'Ushna', vipaka: 'Katu', dosha: 'Balances Pitta & Kapha', classicalUses: ['Kusthaghna', 'Jwaraghna', 'Raktashodhana', 'Hridya'], evidence: 'Moderate', evidenceNote: 'Hepatoprotective and anti-inflammatory effects supported.', formulations: ['Patoladi Kwatha', 'Patolamooladi Kwatha'], source: 'Charaka Samhita, Sutrasthana 4', precautions: 'Generally safe.', emoji: '🥒', image: 'https://upload.wikimedia.org/wikipedia/commons/thumb/5/5e/Trichosanthes_dioica.jpg/640px-Trichosanthes_dioica.jpg', category: 'skin' },""",
    # kantakari
    """  { id: 'kantakari', name: 'Kantakari', sanskrit: 'कण्टकारी', alsoKnownAs: ['Kshudra', 'Vartaki'], botanical: 'Solanum xanthocarpum / Solanum virginianum', family: 'Solanaceae', partsUsed: ['Root', 'Fruit', 'Whole plant'], rasa: ['Katu', 'Tikta'], guna: ['Laghu', 'Ruksha'], virya: 'Ushna', vipaka: 'Katu', dosha: 'Balances Kapha & Vata', classicalUses: ['Kasa-shwasahara', 'Shothahara', 'Deepana', 'Hridya'], evidence: 'Moderate', evidenceNote: 'Bronchodilatory and anti-inflammatory effects supported; one of Dashamula.', formulations: ['Dashamula', 'Kantakaryavaleha', 'Chyawanprash'], source: 'Charaka Samhita, Sutrasthana 4', precautions: 'Hot; limit in Pitta.', emoji: '🌿', image: 'https://upload.wikimedia.org/wikipedia/commons/thumb/5/5e/Solanum_xanthocarpum.jpg/640px-Solanum_xanthocarpum.jpg', category: 'respiratory' },""",
    # brihati
    """  { id: 'brihati', name: 'Brihati', sanskrit: 'बृहती', alsoKnownAs: ['Karatphala', 'Vartaki'], botanical: 'Solanum indicum', family: 'Solanaceae', partsUsed: ['Root', 'Fruit'], rasa: ['Katu', 'Tikta'], guna: ['Laghu', 'Ruksha'], virya: 'Ushna', vipaka: 'Katu', dosha: 'Balances Kapha & Vata', classicalUses: ['Kasa-shwasahara', 'Shothahara', 'Deepana', 'Hridya'], evidence: 'Moderate', evidenceNote: 'Respiratory and anti-inflammatory effects supported; one of Dashamula.', formulations: ['Dashamula', 'Brihatyadi Kwatha', 'Chyawanprash'], source: 'Charaka Samhita, Sutrasthana 4', precautions: 'Hot; limit in Pitta.', emoji: '🌿', image: 'https://upload.wikimedia.org/wikipedia/commons/thumb/5/5e/Solanum_indicum.jpg/640px-Solanum_indicum.jpg', category: 'respiratory' },""",
    # kumari
    """  { id: 'kumari', name: 'Kumari (Aloe Vera)', sanskrit: 'कुमारी', alsoKnownAs: ['Ghritkumari', 'Kanya'], botanical: 'Aloe barbadensis / Aloe vera', family: 'Asphodelaceae', partsUsed: ['Leaf gel', 'Latex'], rasa: ['Tikta', 'Madhura', 'Kashaya'], guna: ['Guru', 'Snigdha'], virya: 'Sheeta', vipaka: 'Katu', dosha: 'Balances Pitta & Vata', classicalUses: ['Virechana', 'Rasayana', 'Kusthaghna', 'Yakrit', 'Vayasthapana'], evidence: 'Strong', evidenceNote: 'Purgative, wound-healing, and hepatoprotective effects well-supported.', formulations: ['Kumaryasava', 'Kumari Asava', 'Aloe gel preparations'], source: 'Charaka Samhita, Sutrasthana 4', precautions: 'Latex is a strong purgative; avoid in pregnancy and menstruation.', emoji: '🌵', image: 'https://upload.wikimedia.org/wikipedia/commons/thumb/5/5e/Aloe_vera.jpg/640px-Aloe_vera.jpg', category: 'skin' },""",
    # lajjalu
    """  { id: 'lajjalu', name: 'Lajjalu (Sensitive Plant)', sanskrit: 'लज्जालु', alsoKnownAs: ['Namaskari'], botanical: 'Mimosa pudica', family: 'Fabaceae', partsUsed: ['Whole plant', 'Root'], rasa: ['Tikta', 'Kashaya'], guna: ['Laghu', 'Ruksha'], virya: 'Sheeta', vipaka: 'Katu', dosha: 'Balances Pitta & Kapha', classicalUses: ['Vranaropana', 'Atisara-ghna', 'Kusthaghna', 'Raktashodhana'], evidence: 'Moderate', evidenceNote: 'Wound-healing and antidiarrheal effects supported.', formulations: ['Lajjalu Ghrita', 'Lajjalpaniya'], source: 'Bhavaprakasha Nighantu', precautions: 'Generally safe.', emoji: '🌿', image: 'https://upload.wikimedia.org/wikipedia/commons/thumb/5/5e/Mimosa_pudica.jpg/640px-Mimosa_pudica.jpg', category: 'skin' },""",
    # jyotishmati
    """  { id: 'jyotishmati', name: 'Jyotishmati', sanskrit: 'ज्योतिष्मती', alsoKnownAs: ['Kanguni'], botanical: 'Celastrus paniculatus', family: 'Celastraceae', partsUsed: ['Seed', 'Seed oil'], rasa: ['Katu', 'Tikta'], guna: ['Tikshna', 'Sara'], virya: 'Ushna', vipaka: 'Katu', dosha: 'Balances Vata & Kapha', classicalUses: ['Medhya', 'Smritida', 'Deepana', 'Unmadahara'], evidence: 'Moderate', evidenceNote: 'Nootropic and memory-enhancing effects supported; seed oil is traditionally used for cognitive support.', formulations: ['Jyotishmati Taila', 'Mahanarayana Taila'], source: 'Bhavaprakasha Nighantu', precautions: 'Hot; limit in Pitta.', emoji: '⭐', image: 'https://upload.wikimedia.org/wikipedia/commons/thumb/5/5e/Celastrus_paniculatus.jpg/640px-Celastrus_paniculatus.jpg', category: 'brain' },""",
    # tagara
    """  { id: 'tagara', name: 'Tagara (Valerian)', sanskrit: 'तगर', alsoKnownAs: ['Nalanda'], botanical: 'Valeriana wallichii', family: 'Caprifoliaceae', partsUsed: ['Root', 'Rhizome'], rasa: ['Katu', 'Tikta', 'Kashaya'], g