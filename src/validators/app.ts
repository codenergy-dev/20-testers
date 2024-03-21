import { ValidatorException } from "../exceptions/validator"

export function validate({
  applicationName,
  packageName,
  testingLink,
  description,
}: App) {
  if (!applicationName || applicationName.length < 1)
    throw new ValidatorException<App>('applicationName', 'Application name is required and must have at least 1 character.')
  if (!packageName || packageName.length < 3)
    throw new ValidatorException<App>('packageName', 'Package name is required and must have at least 3 characters.')
  if (!testingLink || testingLink.length < 10)
    throw new ValidatorException<App>('testingLink', 'Testing link is required and must have at least 10 characters.')
  if (description && description.length > 512)
    throw new ValidatorException<App>('description', 'Description can have a maximun of 512 characters.')
}