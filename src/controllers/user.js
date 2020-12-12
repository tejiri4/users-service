import { User } from "models";
import messages from "utils/messages"

const createUser = async (req, res) => {
  try {
		const { name } = req.filtered;

		const newUser = await User.create({
			name
		});

		return res.status(200).json(newUser)
  } catch(err) {
		return res.status(500).json({ message: messages.serverError });
  }
} 

const getUsers = async (req, res) => {
	try {
		const users = await User.findAll();

		return res.status(200).json(users)
  } catch(err) {
		return res.status(500).json({ message: messages.serverError });
  }
}

const getUser = async (req, res) => {
	try {
		const user = await User.findByPk(req.filtered.id);
		
		if(!user) return res.status(400).json({ message: messages.userNotFound });

		return res.status(200).json(user)
  } catch(err) {
		return res.status(500).json({ message: messages.serverError });
  }
}

const deleteUser = async (req, res) => {
	try {
		const user = await User.findByPk(req.filtered.id);

		if(!user) return res.status(400).json({ message: messages.userNotFound  });

		await user.destroy();

		return res.status(200).json({ message: messages.userDeleted })
  } catch(err) {
		return res.status(500).json({ message: messages.serverError });
  }
}

const updateUser = async (req, res) => {
	try {
		const user = await User.findByPk(req.filtered.id);

		if(!user) return res.status(400).json({ message: messages.userNotFound  });

		await user.update({ name: req.filtered.name });

		return res.status(200).json({ message: messages.userUpdated })
  } catch(err) {
		return res.status(500).json({ message: messages.serverError });
  }
}

export { createUser, getUsers, getUser, deleteUser, updateUser }